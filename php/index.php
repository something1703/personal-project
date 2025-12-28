<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey Tracking System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .container {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 3rem;
            max-width: 600px;
            text-align: center;
        }
        
        h1 {
            color: #2563eb;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        p {
            color: #4b5563;
            font-size: 1.125rem;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #2563eb;
            color: white;
        }
        
        .btn-primary:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
        }
        
        .btn-secondary {
            background: #10b981;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
        }
        
        .info {
            background: #f3f4f6;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-top: 2rem;
            text-align: left;
        }
        
        .info h3 {
            color: #1f2937;
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }
        
        .info ul {
            list-style: none;
            padding: 0;
        }
        
        .info li {
            padding: 0.5rem 0;
            color: #4b5563;
            display: flex;
            align-items: center;
        }
        
        .info li:before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            margin-right: 0.75rem;
            font-size: 1.25rem;
        }
        
        .badge {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 1rem;
        }
        
        @media (max-width: 640px) {
            .container {
                padding: 2rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .buttons {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Survey Tracking System</h1>
        <p>Welcome to the Survey Tracking System. Choose your preferred version:</p>
        
        <div class="buttons">
            <a href="static/index.html" class="btn btn-primary">
                📱 Static HTML Version
            </a>
            <a href="test.php" class="btn btn-secondary">
                🔧 Test Backend API
            </a>
        </div>
        
        <div class="info">
            <h3>📋 Quick Info</h3>
            <ul>
                <li>Static version: Pure HTML/CSS/JS</li>
                <li>Works with PHP backend API</li>
                <li>Fully responsive design</li>
                <li>Admin dashboard included</li>
                <li>No build process required</li>
            </ul>
            
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
                <strong style="color: #1f2937;">Default Login:</strong><br>
                <span style="color: #4b5563;">Username: <code style="background: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">admin</code></span><br>
                <span style="color: #4b5563;">Password: <code style="background: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">admin123</code></span>
            </div>
        </div>
        
        <span class="badge">✨ Production Ready</span>
    </div>
</body>
</html>
